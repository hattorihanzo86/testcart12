import Button  from "@material-ui/core/Button";

import { cartItemType } from "../App";

import { Wrapper } from "./Item.styles";
import React, { useState, useEffect } from 'react';

type Props = {
    item: cartItemType;
    handleAddToCart: (clickedItem: cartItemType) => void;
}


const Item: React.FC<Props> = ({ item, handleAddToCart }) => (
    <Wrapper>
        <img src={item.thumbnail} alt={item.title} />
        <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <h2>${item.price}  </h2>
            <small>{item.stock} available </small>
        </div>
        {
         item.stock === 0 ? <Button>Not Available</Button> :
         <Button onClick={() => handleAddToCart(item)}> Add to cart</Button>

        }
        
    </Wrapper>

)

export default Item;