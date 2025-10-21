// import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
// import { db } from '@src/customAgencyTool/core';
// import type { InterfaceClient } from '@src/customAgencyTool/features/agenda/domain/agendaModel';
// import { adapterAgendaInterfaceClient } from '@src/customAgencyTool/features/agenda/infrastructure/utils/adapterAgendaInterfaceClient';
// import { adapterDate } from '@src/customAgencyTool/utils/adapter';
// import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';

// const Agenda = () => {
//     const handledOnClick = async () => {
//         // crear customerContact
//         // index

//         const sourceCollectionName = 'usersCollection';
//         const targetCollectionName = 'customerContactCollection';

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
//                 const transformedData = adapterDate(
//                     originalData
//                 ) as InterfaceClient;

//                 const fixData = adapterAgendaInterfaceClient(transformedData);

//                 //
//                 const newCustomerContact = fixData.customerContact.filter(
//                     (item) => item.id.startsWith('new-')
//                 );
//                 const customerDocRef = doc(
//                     db,
//                     targetCollectionName,
//                     document.id
//                 );

//                 // Añadir la operación de escritura al lote
//                 fixData.customerContact = [];
//                 batch.set(targetDocRef, fixData);

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
//             <MyText>Agenda</MyText>
//             <MyFlex direction={'row'} bento>
//                 <p>generar index - Agenda</p>
//                 <p>generar customerContact</p>
//                 <p>generar index - customerContact</p>
//             </MyFlex>

//             <button onClick={handledOnClick}>click me</button>
//         </div>
//     );
// };

// export default Agenda;
