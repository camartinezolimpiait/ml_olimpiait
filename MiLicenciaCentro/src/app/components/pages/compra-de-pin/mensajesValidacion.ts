export const MensajesValidacion = {
    email: {
        'required': 'Email es requerido',
        'email': 'Email no está en formato válido',
        'pattern': 'Email no está en formato válido'
    },
    celular: {
        'required': 'Necesitamos tu celular para enviarte notificaciones del proceso',
        'minlength': 'Debe tener 10 dígitos',
        'pattern': 'Número de celular no valido'
    },
    nombres: {
        'required': 'Nombre(s) son requeridos',
        'pattern': 'Solo se aceptan letras.'
    },
    apellidos: {
        'required': 'Apellidos son requeridos',
        'pattern': 'Solo se aceptan letras.'
    },
    tipoDocumento: {
        'required': 'Selecciona un tipo de documento',

    },
    documento: {
        'required': 'Escribe tu documento',
        'minlength': 'Debe tener minimo 6 dígitos',
        'pattern': 'No puedes colocar espacios'
    }
};

