// import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
// import { db } from '@src/customAgencyTool/core';
// import { adapterDate } from '@src/customAgencyTool/utils/adapter';
// import {
//     collection,
//     doc,
//     getDocs,
//     query,
//     writeBatch
// } from 'firebase/firestore';
// import {
//     generateSearchIndices,
//     type ValueKeyConfigItem
// } from './generateSearchIndices';

// const ProformaInvoice = () => {
//     const collectionName = '';

//     const collectionDestiny = '';

//     const fixFormatProformaInvoice = async () => {
//         try {
//             const MAX_BATCH = 499; // Firestore limit is 500
//             let batchCount = 0;
//             let totalUpdated = 0;

//             // Get all documents from collection
//             const q = query(collection(db, collectionName));
//             const snapshot = await getDocs(q);

//             let batch = writeBatch(db);

//             for (const doc of snapshot.docs) {
//                 const beforData = {
//                     ...doc.data(),
//                     id: doc.id
//                 };

//                 const data = adapterDate(beforData);

//                 // FixProformaInvoice
//                 const dataFix = { ...data };

//                 batch.update(doc.ref, dataFix);
//                 batchCount++;
//                 totalUpdated++;

//                 if (batchCount === MAX_BATCH) {
//                     await batch.commit();
//                     batch = writeBatch(db);
//                     batchCount = 0;
//                 }
//             }

//             if (batchCount > 0) {
//                 await batch.commit();
//             }

//             return {
//                 success: true,
//                 documentsUpdated: totalUpdated
//             };
//         } catch (error) {
//             console.error('Error updating collection:', error);
//             throw error;
//         }
//     };

//     const migrationCollection = async () => {
//         const sourceCollectionName = 'ProformaInvoiceCollection';
//         const targetCollectionName = 'index-ProformaInvoiceCollection';

//         console.log(
//             `Iniciando migración de '${sourceCollectionName}' a '${targetCollectionName}'...`
//         );

//         try {
//             const MAX_BATCH_OPERATIONS = 499; // Límite de Firestore es 500
//             let batch = writeBatch(db);
//             let operationCount = 0;
//             let totalDocsMigrated = 0;

//             // Referencia a la colección de origen
//             const sourceCollectionRef = collection(db, sourceCollectionName);
//             const snapshot = await getDocs(sourceCollectionRef);

//             if (snapshot.empty) {
//                 console.log(
//                     'La colección de origen está vacía. No hay nada que migrar.'
//                 );
//                 return;
//             }

//             console.log(
//                 `Se encontraron ${snapshot.size} documentos para migrar.`
//             );

//             for (const document of snapshot.docs) {
//                 // Datos originales
//                 const originalData = {
//                     ...document.data(),
//                     id: document.id
//                 };

//                 // ***** LA CORRECCIÓN CLAVE ESTÁ AQUÍ *****
//                 // Crear una referencia al nuevo documento en la colección de destino
//                 // Usamos el MISMO ID del documento original.
//                 const targetDocRef = doc(db, targetCollectionName, document.id);

//                 // Transformar los datos usando tu función adaptadora
//                 const transformedData = adapterDate(originalData);

//                 const searchIndexPayload = generateSearchIndices(
//                     transformedData,
//                     proformaInvoiceValueKeySettings
//                 );

//                 // Añadir la operación de escritura al lote
//                 batch.set(targetDocRef, searchIndexPayload);

//                 operationCount++;
//                 totalDocsMigrated++;

//                 // Cuando el lote alcanza el límite, se ejecuta y se reinicia.
//                 if (operationCount === MAX_BATCH_OPERATIONS) {
//                     console.log(
//                         `Escribiendo un lote de ${operationCount} documentos...`
//                     );
//                     await batch.commit();
//                     // Iniciar un nuevo lote
//                     batch = writeBatch(db);
//                     operationCount = 0;
//                 }
//             }

//             // Ejecutar el último lote si quedaron operaciones pendientes
//             if (operationCount > 0) {
//                 console.log(
//                     `Escribiendo el último lote de ${operationCount} documentos...`
//                 );
//                 await batch.commit();
//             }

//             console.log('✅ Migración completada exitosamente.');
//             console.log(
//                 `   Total de documentos migrados: ${totalDocsMigrated}`
//             );
//         } catch (error) {
//             console.error('❌ Error migrando la colección:', error);
//         }
//     };

//     return (
//         <div>
//             <MyText>Proforma Invoice</MyText>
//             <MyFlex direction={'row'} bento>
//                 <p>fix format </p>
//                 <p>generar index </p>
//                 <p>Asignar clientId ✅</p>
//                 <p>Cargar la lista de los proveedores</p>
//             </MyFlex>
//         </div>
//     );
// };

// export default ProformaInvoice;

// export const proformaInvoiceValueKeySettings: ValueKeyConfigItem[] = [
//     { path: 'id', applyNgrams: false },
//     { path: 'quoteNumber', applyNgrams: true, ngramSize: 3 },
//     { path: 'agent', applyNgrams: false },
//     { path: 'email', applyNgrams: false },
//     { path: 'shippingCompany', applyNgrams: true, ngramSize: 3 },
//     { path: 'shippingExecutives', applyNgrams: true, ngramSize: 3 },
//     { path: 'loadingLocation', applyNgrams: true, ngramSize: 3 },
//     { path: 'placeOfUnloading', applyNgrams: true, ngramSize: 3 },
//     { path: 'importExportServices.groupName', applyNgrams: false },
//     { path: 'importExportServices.groupList.feedback', applyNgrams: false },
//     {
//         path: 'importExportServices.groupChargingOverview.description',
//         applyNgrams: false
//     },
//     { path: 'clientId', applyNgrams: false },
//     { path: 'clientName', applyNgrams: true, ngramSize: 3 },
//     { path: 'clientContact', applyNgrams: true, ngramSize: 3 }
// ];
