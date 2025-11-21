'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Product, CartItem } from './types';

// StoredUser interface for simulation
interface StoredUser extends User {
  passwordHash: string;
}

// --- Auth Context ---
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('sole-searcher-users');
      setUsers(storedUsers ? JSON.parse(storedUsers) : []);
      const storedSession = localStorage.getItem('sole-searcher-session');
      setCurrentUser(storedSession ? JSON.parse(storedSession) : null);
    } catch (error) {
      console.error("Failed to load from local storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUsersToStorage = (updatedUsers: StoredUser[]) => {
    try {
      localStorage.setItem('sole-searcher-users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Failed to save users to local storage", error);
    }
  };

  const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email);
        if (!user || user.passwordHash !== password) {
          reject(new Error('Invalid email or password.'));
          return;
        }
        const sessionUser: User = { id: user.id, email: user.email, role: user.role };
        setCurrentUser(sessionUser);
        localStorage.setItem('sole-searcher-session', JSON.stringify(sessionUser));
        resolve(sessionUser);
      }, 500);
    });
  };

  const register = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
       setTimeout(() => {
        if (users.find(u => u.email === email)) {
          reject(new Error('An account with this email already exists.'));
          return;
        }
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const role = email.toLowerCase() === 'admin@solesearcher.com' ? 'ADMIN' : 'USER';
        const newUser: StoredUser = { id, email, passwordHash: password, role };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);

        const sessionUser: User = { id, email, role };
        setCurrentUser(sessionUser);
        localStorage.setItem('sole-searcher-session', JSON.stringify(sessionUser));
        resolve(sessionUser);
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sole-searcher-session');
  };

  const value = { currentUser, login, register, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};


// --- Product Context ---
interface ProductContextType {
    products: Product[];
    addProduct: (productData: Omit<Product, 'id'>) => void;
    updateProduct: (updatedProduct: Product) => void;
    deleteProduct: (productId: number) => void;
}
const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getInitialProducts = (): Product[] => [
    { id: 1, name: 'AeroGlide 1', price: '$180', imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1925&auto=format&fit=crop' },
    { id: 2, name: 'Quantum Leap', price: '$220', imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, name: 'Stealth Runner', price: '$150', imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1964&auto=format&fit=crop' },
    { id: 4, name: 'Vertex High-Top', price: '$250', imageUrl: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1974&auto=format&fit=crop' },
    { id: 5, name: 'Nova Trainer', price: '$195', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop' },
    { id: 6, name: 'Echo Classic', price: '$130', imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop' },
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        try {
            const savedProducts = localStorage.getItem('sole-searcher-products');
            if (savedProducts) {
                setProducts(JSON.parse(savedProducts));
            } else {
                const initialProducts = getInitialProducts();
                setProducts(initialProducts);
                localStorage.setItem('sole-searcher-products', JSON.stringify(initialProducts));
            }
        } catch (error) {
            console.error("Failed to load products from local storage", error);
            setProducts(getInitialProducts());
        }
    }, []);

    const saveProducts = (updatedProducts: Product[]) => {
        try {
            localStorage.setItem('sole-searcher-products', JSON.stringify(updatedProducts));
        } catch (error) {
            console.error("Failed to save products to local storage", error);
        }
    };

    const addProduct = (productData: Omit<Product, 'id'>) => {
        setProducts(prev => {
            const newProduct = { ...productData, id: Date.now() };
            const updated = [...prev, newProduct];
            saveProducts(updated);
            return updated;
        });
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => {
            const updated = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            saveProducts(updated);
            return updated;
        });
    };

    const deleteProduct = (productId: number) => {
        setProducts(prev => {
            const updated = prev.filter(p => p.id !== productId);
            saveProducts(updated);
            return updated;
        });
    };

    const value = { products, addProduct, updateProduct, deleteProduct };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) throw new Error('useProducts must be used within a ProductProvider');
    return context;
};

// --- Cart Context ---
interface CartContextType {
    cartItems: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    cartCount: number;
    totalPrice: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (currentUser) {
            try {
                const savedCart = localStorage.getItem(`sole-searcher-cart-${currentUser.id}`);
                setCartItems(savedCart ? JSON.parse(savedCart) : []);
            } catch (error) {
                 console.error("Failed to load cart from local storage", error);
                 setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            try {
                localStorage.setItem(`sole-searcher-cart-${currentUser.id}`, JSON.stringify(cartItems));
            } catch (error) {
                console.error("Failed to save cart to local storage", error);
            }
        }
    }, [cartItems, currentUser]);

    const addItem = (product: Product) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.product.id === product.id);
            if (existingItem) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeItem = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

    const totalPrice = useMemo(() => cartItems.reduce((total, item) => {
        const price = parseFloat(item.product.price.replace('$', ''));
        return total + (price * item.quantity);
    }, 0), [cartItems]);

    const value = { cartItems, addItem, removeItem, cartCount, totalPrice };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) throw new Error('useCart must be used within a CartProvider');
    return context;
};
