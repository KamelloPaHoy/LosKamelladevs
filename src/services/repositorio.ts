import {
  addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { COL } from "./colecciones";

// ---------- USUARIO ----------
export const crearUsuario = async (uid: string, perfil: any, telefono: string) => {
  await setDoc(doc(db, COL.usuario, uid), {
    ...perfil,
    ratingPromedio: 0,
    ratingCount: 0,
    aceptoPolitica: true,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, COL.usuarioPrivado, uid), { telefono, expoPushToken: "" });
};

export const obtenerUsuario = async (uid: string) => {
  const s = await getDoc(doc(db, COL.usuario, uid));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};

// ---------- TRABAJO ----------
export const crearTrabajo = (uid: string, nombre: string, datos: any) =>
  addDoc(collection(db, COL.trabajo), {
    ...datos,
    publicadorId: uid,
    publicadorNombre: nombre,
    estado: "publicado",
    asignadoA: null,
    aceptoPublicador: false,
    aceptoTrabajador: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const buscarTrabajos = async (categoria?: string) => {
  const filtros = [where("estado", "==", "publicado")];
  if (categoria) filtros.push(where("categoria", "==", categoria));
  const q = query(collection(db, COL.trabajo), ...filtros, orderBy("createdAt", "desc"));
  return (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const cambiarEstado = (trabajoId: string, estado: string) =>
  updateDoc(doc(db, COL.trabajo, trabajoId), { estado, updatedAt: serverTimestamp() });

// ---------- POSTULACIONES ----------
export const postularse = (trabajoId: string, uid: string, nombre: string, mensaje: string) =>
  setDoc(doc(db, COL.trabajo, trabajoId, COL.postulaciones, uid), {
    trabajadorId: uid,
    trabajadorNombre: nombre,
    mensaje,
    estado: "pendiente",
    createdAt: serverTimestamp(),
  });

export const elegirPostulado = (trabajoId: string, uidElegido: string) =>
  updateDoc(doc(db, COL.trabajo, trabajoId), {
    asignadoA: uidElegido,
    estado: "asignado",
    updatedAt: serverTimestamp(),
  });

// ---------- MENSAJE ----------
export const enviarMensaje = (trabajoId: string, autorId: string, texto: string) =>
  addDoc(collection(db, COL.mensaje), {
    trabajoId, autorId, texto, createdAt: serverTimestamp(),
  });

export const obtenerMensajes = async (trabajoId: string) => {
  const q = query(
    collection(db, COL.mensaje),
    where("trabajoId", "==", trabajoId),
    orderBy("createdAt", "asc")
  );
  return (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ---------- CONTACTOS (solo cuando ambos aceptan) ----------
export const guardarContacto = (trabajoId: string, uid: string, nombre: string, telefono: string) =>
  setDoc(doc(db, COL.contactos, `${trabajoId}_${uid}`), { trabajoId, nombre, telefono });

// ---------- CALIFICACION (solo si el trabajo está terminado) ----------
export const calificar = (
  trabajoId: string, autorId: string, paraUid: string, estrellas: number, comentario: string
) =>
  setDoc(doc(db, COL.calificacion, `${trabajoId}_${autorId}`), {
    trabajoId, autorId, paraUid, estrellas, comentario, createdAt: serverTimestamp(),
  });
