import axios from 'axios';
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

export const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {

  const dedeNsabeReact = () => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  }

  //Criando um estado(carrinho) que é do tipo product que é um lista de Produtos
  const [cart, setCart] = useState<Product[]>(dedeNsabeReact);


  const addProduct = async (productId: number) => {
    try { 
      debugger;
      let myCart = {...cart};
      //busca produto
      const produtoAdicionado = await api.get(`products/${productId}`);
      const idProduto = produtoAdicionado.data.id

      const produtoEncontrado = myCart.find(x => x.id === idProduto);
      console.log(produtoEncontrado);
      const estoque = await api.get(`stock/${produtoEncontrado?.id}`);
      const qntDisponivel = estoque.data.amount;

      if(qntDisponivel > 0 ){
        toast.error('Quantidade solicitada fora de estoque');
      }

      if(produtoEncontrado){
        myCart.push(produtoEncontrado);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(myCart));
      } 

      setCart(myCart);
      
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
