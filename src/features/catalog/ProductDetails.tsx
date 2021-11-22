import { LoadingButton } from "@mui/lab";
import { Divider, Grid, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import NotFound from "../../app/errors/NotFound";
import LoaddingComponent from "../../app/layout/LoaddingComponent";
import { Product } from "../../app/models/product";

export default function ProductDetails() {
    const{basket,setBasket,removeItem}=useStoreContext();
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
   const [ quantity,SetQuantity] =useState(0);
   const[submitting,setSubmitting] =useState(false);
   const item = basket?.items.find(i=> i.productId=== product?.id);

    useEffect(() => {
        if(item ) SetQuantity(item.quantity);
        agent.Catalog.details(parseInt(id))
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id,item])
    function handleInputChange(event:any){
        if(event.target.value >0){
            SetQuantity(parseInt(event.target.value));
        }
    
    }
    function handleUpdateCart(){
        setSubmitting(true);
        if(!item || quantity >item.quantity){
            const updatedQuantity = item ? quantity - item.quantity:quantity;
            agent.Basket.addItem(product?.id!,updatedQuantity)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setSubmitting(false));
        }
        else{
            const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product?.id!,updatedQuantity)
            .then(() => removeItem(product?.id!,updatedQuantity))
            .catch(error => console.log(error))
            .finally(() => setSubmitting(false));
        }
    }
    if (loading) return <LoaddingComponent message='Loadding product detail...' />

    if (!product) return <NotFound />
    return (
   
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
                </Grid>
                <Grid>
                    <Typography variant='h3'>
                        {product.name}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant='h4' color='secondary'>
                        {product.price}
                    </Typography>
                    <TableContainer>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </TableContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                            onChange={handleInputChange} 
                            variant='outlined' 
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}>

                            </TextField>
                        </Grid>
                            <Grid item xs={6}>
                                <LoadingButton
                                disabled={item?.quantity===quantity || !item && quantity ===0}
                                loading={submitting}
                                onClick={handleUpdateCart}
                                sx={{height:'55'}}
                                color='primary'
                                size='large'
                                variant='contained'
                                fullWidth>
                                    {item?'Update Quantity':'Add to Cart'}
                                </LoadingButton>
                            </Grid>
                    </Grid>
                </Grid>
            </Grid>
      
    )
}