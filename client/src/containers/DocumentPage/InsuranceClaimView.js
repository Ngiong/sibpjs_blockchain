import React from 'react'
import MaterialTextField from '@material-ui/core/TextField'
import { DatePicker } from '@material-ui/pickers'

class InsuranceClaimView extends React.Component{
  render(){
    const { data } = this.props
    return (
      <div>
        <div className='account-page-section-title'>Informasi Klaim</div>
        <MaterialTextField 
          label="Authored By"
          value= {data.documentAuthorName}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Health Provider"
          value= {data.claimHealthProviderName}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <DatePicker 
          margin="normal" 
          label="Created At" 
          value= {data.claimVisitDate} 
          format='MMMM Do YYYY' 
          InputProps={{
            readOnly: true,
          }} 
          fullWidth
        />

        <MaterialTextField 
          label="Diagnosis"
          value= {data.claimDiagnosis}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Amount"
          value= {data.claimAmount}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Treatment"
          value= {data.medicalTreatment}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Prescription"
          value= {data.medicalPrescription}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      </div>
    );
  }
}
export default InsuranceClaimView