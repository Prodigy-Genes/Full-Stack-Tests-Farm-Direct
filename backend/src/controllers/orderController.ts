import { Response } from 'express';
import { AuthenticatedRequest, CreateOrderData, CartItem } from '../types';
import prisma from '../db';

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Only customers can create orders' });
    }

    const { items }: CreateOrderData = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Validate and calculate total price
    let totalPrice = 0;
    const orderItems: { productId: string; quantity: number; price: number; }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(400).json({ 
          error: `Product with ID ${item.productId} not found` 
        });
      }

      if (!product.isActive) {
        return res.status(400).json({ 
          error: `Product ${product.name} is not available` 
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order with transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.order.create({
        data: {
          customerId: user.id,
          totalPrice,
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                  farmer: {
                    select: {
                      name: true,
                      farmName: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Update product quantities
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: result
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCustomerOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Only customers can access their orders' });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: user.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                farmer: {
                  select: {
                    name: true,
                    farmName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFarmerOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can access their orders' });
    }

    // Get orders that contain products from this farmer
    const orders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              farmerId: user.id
            }
          }
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          where: {
            product: {
              farmerId: user.id
            }
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              include: {
                farmer: {
                  select: {
                    id: true,
                    name: true,
                    farmName: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user has access to this order
    const hasAccess = user.role === 'CUSTOMER' 
      ? order.customerId === user.id
      : order.orderItems.some(item => item.product.farmerId === user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;

    if (!user || user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can update order status' });
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    // Check if farmer has products in this order
    const order = await prisma.order.findFirst({
      where: {
        id,
        orderItems: {
          some: {
            product: {
              farmerId: user.id
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found or you do not have permission to update it' 
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};