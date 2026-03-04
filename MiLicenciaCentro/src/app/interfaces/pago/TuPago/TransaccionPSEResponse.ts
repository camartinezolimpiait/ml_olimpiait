export interface TransaccionPSEResponse{
    Code: string;
    dataPSE: DataPSE;
    messageError: string;
}

export interface DataPSE{
    urlPSE: string;
    ticketID: string;
}


