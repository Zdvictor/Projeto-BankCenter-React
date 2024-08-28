import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard(props) {


  function scroll() {

    window.scrollTo({top: 0, behavior: "smooth"})

  }

  return (
    <Card sx={{ minWidth: 275, marginTop: 3 }}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.secondary" gutterBottom>
            Empréstimo 
        </Typography>
        <Typography sx={{ mb: 1.5, fontSize: 30 }} color="text.secondary">
          Valor:
        </Typography>
        <Typography sx={{fontSize: 30}} variant="body2">
            R$ {props.valor } <small>12x de R$ {Math.round(props.valor / 12)}</small>
        </Typography>
      </CardContent>
      <CardActions>
        
        <Button onClick={scroll} style={
            {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            backgroundColor: "rgb(51, 157, 255)",
            fontSize: 20,
            }
            }>ADQUIRA AGORA MESMO!!</Button>
      </CardActions>
    </Card>
  );
}
