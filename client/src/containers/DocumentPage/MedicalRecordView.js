import React from 'react'
import MaterialTextField from '@material-ui/core/TextField'

class MedicalRecordView extends React.Component{
  render(){
    const { data } = this.props
    return (
      <div>
        <div className='account-page-section-title'>Informasi Medis</div>
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
          label="Symptoms"
          value= {data.medicalSymptoms}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Diagnosis"
          value= {data.medicalDiagnosis}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />

        <MaterialTextField 
          label="Doctor"
          value= {data.medicalDoctor}
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
export default MedicalRecordView