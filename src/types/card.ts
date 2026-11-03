export type Carta = {
    id: string;
    nombre: string;
    precio: number | null;
    descripcion: string;
    expansion: string;
    numero: string;
    imagen: string | null;
};

export type ArticuloCarrito = {
    carta: Carta;
    cantidad: number;
};