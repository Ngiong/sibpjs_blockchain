import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class SimpleCard extends React.Component{
  render(){
    const type = this.props.documentType === 'MEDICAL_RECORD' ? 'Rekam Medis'
      : this.props.documentType === 'INSURANCE_CLAIM' ? 'Klaim Asuransi' : 'Polis Asuransi'
    return (
      // <Card onMouseOver={true} 
      // onMouseOut={true} 
      <Card raised={true}>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 24 }}>#{this.props.id}</div>
            <div style={{ fontSize: 12 }}>{this.props.date}</div>
          </div>
          <Typography color='primary'>
            {this.props.title}
          </Typography>
          <div>
            Jenis: <Typography color='secondary' style={{ fontSize: 16, display: 'inline' }}>{type}</Typography>
          </div>
          <div style={{ height: '1.3em' }} />
          <Typography variant="body2" component="p" style={{ fontSize: 18 }}>
            {this.props.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" fullWidth>View</Button>
        </CardActions>
      </Card>
    );
  }
}
export default SimpleCard