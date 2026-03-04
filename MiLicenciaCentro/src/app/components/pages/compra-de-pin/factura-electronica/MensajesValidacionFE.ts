export const MensajesValidacionFE = {
    correoFE: {
        'required': 'Email es requerido',
        'email': 'Email no está en formato válido',
        'pattern': 'Email no está en formato válido'
    },
      tipoPersonaFE: {
        'required': 'Selecciona un tipo de persona',       
    },
      nombresFE: {
        'required': 'Nombre(s) son requeridos',
        'pattern': 'Solo se aceptan letras.'
    },
      apellidosFE: {
       'required': 'Apellidos son requeridos',
        'pattern': 'Solo se aceptan letras.'
    },
      tipoDocumentoFE: {
        'required': 'Selecciona un tipo de documento',
    },
      documentoFE: {
       'required': 'Escribe tu documento',
        'minlength': 'El documento no cuenta con el mínimo de caracteres.',
        'pattern': 'No puedes colocar espacios'
    },
      razonSocial: {
        'required': 'Razón social es requerido', 
        'pattern': 'Solo se aceptan letras.'       
    },
      nombreComercial: {
       'required': 'El nombre comercial es requerido',
        'pattern': 'Solo se aceptan letras.'
    },
    nit:{
        'required': 'NIT es requerido',
        'pattern': 'No se aceptan caracteres especiales'
    }  
}