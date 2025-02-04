class ResponseBuilder {
    constructor() {
        this.response = {
            ok: false,
            status: 100,
            message: '',
            payload: {}
        };
    }

    // Establecer el estado de "ok"
    setOk(ok) {
        this.response.ok = ok;
        return this;
    }

    // Establecer el estado de la respuesta
    setStatus(status) {
        this.response.status = status;
        return this;
    }

    // Establecer el mensaje de la respuesta
    setMessage(message) {
        this.response.message = message;
        return this;
    }

    // Establecer el payload de la respuesta
    setPayload(payload) {
        this.response.payload = payload;
        return this;
    }

    // Construir y devolver la respuesta
    build() {
        return this.response;
    }
}

export default ResponseBuilder;
