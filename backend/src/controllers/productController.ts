import { Request, Response } from 'express';
import { AuthenticatedRequest, CreateProductData } from '../types';
import prisma from '../db';

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can create products' });
    }

    const {
      name,
      description,
      price,
      category,
      quantity,
      harvestDate,
      expiryDate
    }: CreateProductData = req.body;

    // Validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        error: 'Name, description, price, category, and quantity are required'
      });
    }

    if (price <= 0 || quantity <= 0) {
      return res.status(400).json({
        error: 'Price and quantity must be greater than 0'
      });
    }

    // Handle image upload (if file was uploaded)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const productData: any = {
      name,
      description,
      price: parseFloat(price.toString()),
      category,
      quantity: parseInt(quantity.toString()),
      farmerId: user.id,
      imageUrl
    };

    if (harvestDate) {
      productData.harvestDate = new Date(harvestDate);
    }

    if (expiryDate) {
      productData.expiryDate = new Date(expiryDate);
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            farmName: true,
            farmAddress: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = '1',
      limit = '12'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      isActive: true,
      quantity: { gt: 0 }
    };

    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
              farmName: true,
              farmAddress: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            farmName: true,
            farmAddress: true,
            phone: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user || user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can update products' });
    }

    // Check if product exists and belongs to the farmer
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (existingProduct.farmerId !== user.id) {
      return res.status(403).json({ error: 'You can only update your own products' });
    }

    const {
      name,
      description,
      price,
      category,
      quantity,
      harvestDate,
      expiryDate,
      isActive
    } = req.body;

    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price.toString());
    if (category) updateData.category = category;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity.toString());
    if (harvestDate) updateData.harvestDate = new Date(harvestDate);
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle image upload if new file was uploaded
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            farmName: true,
            farmAddress: true
          }
        }
      }
    });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user || user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can delete products' });
    }

    // Check if product exists and belongs to the farmer
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (existingProduct.farmerId !== user.id) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFarmerProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can access this endpoint' });
    }

    const products = await prisma.product.findMany({
      where: { farmerId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ products });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};