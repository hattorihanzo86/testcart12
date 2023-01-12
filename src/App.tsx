import React, { useEffect } from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';

import  Item from './Item/Item';
import Cart from './Cart/Cart';
import { Drawer } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge';

import { Wrapper,  StyledButton } from './App.styles';

export type cartItemType = {
  id: number;
  category: string;
  description: string;
  thumbnail: string;
  price: number;
  title: string;
  amount: number;
  stock: number;
}



const getProducts = async (): Promise<cartItemType[]> =>
await( await fetch('https://dummyjson.com/products')).json();

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as cartItemType[]);
  const [stocks, setStocks] = useState([] as cartItemType[]);



  const { data, isLoading, error } = useQuery<cartItemType[]>('products',
   getProducts);
   console.log(data)

   const getTotalItems = (items: cartItemType[] ) => 
    items.reduce((ack: number, item) => ack + item.amount, 0);
   
   const handleAddToCart = (clickedItem: cartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if(isItemInCart) {
        return prev.map(item => 
          item.id === clickedItem.id 
          ? { ...item, amount: item.amount +1}
          : item
          );
      }
      return [  ...prev, { ...clickedItem, amount: 1}];
      
    })
    setStocks(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id)
      console.log(isItemInCart)
 
      if(isItemInCart) {
        return prev.map(item => 
          item.id === clickedItem.id 
          ? { ...item, stock: item.stock - 1}
          : item
          );
     
      }
      return [  ...prev, { ...clickedItem, stock: 1 }];
  
      
    })
   }

   const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as cartItemType[])
    );
  };

   

   if(isLoading) return <LinearProgress />;
  //  if(error) return <div> something went wrong ...</div>


  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart 
        cartItems={cartItems}
        addToCart={handleAddToCart}
        removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />

        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.products.map(item => (
          <Grid item key={item.id} xs={12} sm={4}> 
          <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}

      </Grid>
    </Wrapper>
  );
}

export default App;
