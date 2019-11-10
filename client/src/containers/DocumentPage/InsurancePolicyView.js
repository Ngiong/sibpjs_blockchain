import React from 'react'
import MaterialTextField from '@material-ui/core/TextField'
import { DatePicker } from '@material-ui/pickers'

class InsurancePolicyView extends React.Component{
  render(){
    const { data } = this.props
    return (
      <div>
        <div className='account-page-section-title'>Informasi Polis</div>
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
          label="Client Name"
          value= {data.policyClientName}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Allowed Providers"
          value= {data.policyAllowedProviders}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Allowed Treatments"
          value= {data.policyAllowedTreatments}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Terms and Conditions"
          value= {data.policyTnC}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Max Claim"
          value= {data.policyMaxClaims}
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
export default InsurancePolicyView