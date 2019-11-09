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
        />

        <MaterialTextField 
          label="Symptoms"
          value= {data.medicalSymptoms}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        <MaterialTextField 
          label="Diagnosis"
          value= {data.medicalDiagnosis}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        <MaterialTextField 
          label="Doctor"
          value= {data.medicalDoctor}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        <MaterialTextField 
          label="Treatment"
          value= {data.medicalTreatment}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        <MaterialTextField 
          label="Prescription"
          value= {data.medicalPrescription}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  }
}
export default MedicalRecordView