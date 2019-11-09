import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import TextField from '../../components/TextField'
import TextField from '@material-ui/core/TextField'
// import DateField from '../../components/DateField'

class InsuranceView extends React.Component{
  render(){
    const { data } = this.props
    return (
      // <Card onMouseOver={true} 
      // onMouseOut={true} 
      <div>
        <div className='account-page-section-title'>Informasi Klaim</div>
        <TextField
          label="Nama Penyedia Layanan Kesehatan"
          value= {data.claimHealthProviderName}
          className={classes.textField}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        {/* {TextField('Nama Penyedia Layanan Kesehatan', data.claimHealthProviderName, null)}
        {DateField('Tanggal Kunjungan', data.claimVisitDate, this.handleInputChange.bind(this, FIELD.CLAIM_VISIT_DATE))}
        {TextField('Diagnosis', data.claimDiagnosis, this.handleInputChange.bind(this, FIELD.CLAIM_DIAGNOSIS))}
        {TextField('Jumlah Klaim', data.claimAmount, this.handleInputChange.bind(this, FIELD.CLAIM_AMOUNT))} */}
      </div>
    );
  }
}
export default InsuranceView