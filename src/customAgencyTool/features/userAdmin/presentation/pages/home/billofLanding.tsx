// import { MyButton, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
// import { db } from '@src/customAgencyTool/core';
// import { adapterDate } from '@src/customAgencyTool/utils/adapter';
// import {
//     collection,
//     doc,
//     getDocs,
//     query,
//     writeBatch
// } from 'firebase/firestore';
// import { useState } from 'react';
// import {
//     generateSearchIndices,
//     type ValueKeyConfigItem
// } from './generateSearchIndices';

// const BillofLanding = () => {
//     const onClick = async () => {
//         //
//     };

//     return (
//         <div>
//             <MyText>Bill of Landing</MyText>

//             <MyFlex direction={'row'} bento>
//                 <p onClick={onClick}>generar index</p>
//             </MyFlex>

//             <GenerateIndex />
//         </div>
//     );
// };

// export default BillofLanding;

// const TempUpperCaseClienteName = () => {
//     const collectionName = 'billsCollections';
//     const fieldName = 'docID';

//     const [isLoading, setIsLoading] = useState(false);

//     const updateCollectionToUppercase = async () => {
//         setIsLoading(true);
//         try {
//             const MAX_BATCH = 499; // Firestore limit is 500
//             let batchCount = 0;
//             let totalUpdated = 0;

//             // Get all documents from collection
//             const q = query(collection(db, collectionName));
//             const snapshot = await getDocs(q);

//             let batch = writeBatch(db);

//             for (const doc of snapshot.docs) {
//                 const data = doc.data();
//                 const fieldValue = data[fieldName];

//                 if (
//                     typeof fieldValue === 'string' &&
//                     fieldValue !== fieldValue.toUpperCase()
//                 ) {
//                     batch.update(doc.ref, {
//                         [fieldName]: fieldValue.toUpperCase()
//                     });
//                     batchCount++;
//                     totalUpdated++;
//                 }

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
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <MyButton onClick={updateCollectionToUppercase} loading={isLoading}>
//             Temp Upper Case Cliente Name {collectionName}
//         </MyButton>
//     );
// };

// const GenerateIndex = () => {
//     const [isLoading, setIsLoading] = useState(false);

//     const handleClick = async () => {
//         const sourceCollectionName = 'billsCollections';
//         const targetCollectionName = 'index-billsCollections';

//         console.log(
//             `Iniciando migración de '${sourceCollectionName}' a '${targetCollectionName}'...`
//         );

//         try {
//             setIsLoading(true);

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
//                 ) as InterfaceFatherBillOfLanding;

//                 const searchIndexPayload = generateSearchIndices(
//                     transformedData,
//                     generateIndexBillOfLanding(transformedData)
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
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div>
//             <MyButton
//                 colorPalette={'edit'}
//                 onClick={handleClick}
//                 loading={isLoading}
//             >
//                 Recorrer colección y generar índices{' '}
//                 {isLoading ? 'Loading...' : ''}
//             </MyButton>
//         </div>
//     );
// };

// export enum EnumTypeBL {
//     INIT = 'init',

//     ROA_MANIFEST1 = 'roa_manifest1',
//     ROA_FORM1 = 'roa_form1',
//     ROA_FORM2 = 'roa_form2',

//     SEA_FORM1 = 'sea_form1',
//     SEA_FORM2 = 'sea_form2',

//     AIR_FORM1 = 'air_form1'
// }

// export interface InterfaceFatherBillOfLanding {
//     id: string;
//     blType: EnumTypeBL;
//     docID: string;
//     logo: string;
//     date: Date | number | string;
//     createAt: Date | number | string;
//     linesDescription: string;

//     dateOfdeparture: Date | number | string;
//     dateOfarrival: Date | number | string;
//     status: string;
// }

// export const billOfLandingValueKeySettings: ValueKeyConfigItem[] = [
//     // Father
//     { path: 'id', applyNgrams: false },
//     { path: 'docID', applyNgrams: false },
//     { path: 'linesDescription', applyNgrams: false },

//     // InterFaceFreightChargesFather
//     // { path: 'freight_charges.description', applyNgrams: false },

//     /**
//      *  ? -----------------------------
//      *  * AIR st1
//      *  ? -----------------------------
//      */
//     { path: 'hawb', applyNgrams: false, ngramSize: 3 },
//     { path: 'shipper', applyNgrams: false, ngramSize: 3 },
//     { path: 'consignee', applyNgrams: false, ngramSize: 3 },
//     { path: 'issuing_carrier_name_address', applyNgrams: false, ngramSize: 3 },
//     { path: 'agents_iata', applyNgrams: false, ngramSize: 3 },
//     {
//         path: 'airport_ofdeparture_and_requested_routing',
//         applyNgrams: false,
//         ngramSize: 3
//     },
//     { path: 'accounting_info', applyNgrams: false, ngramSize: 3 },
//     { path: 'to', applyNgrams: false, ngramSize: 3 },
//     { path: 'first_carrier', applyNgrams: false, ngramSize: 3 },
//     { path: 'l_to', applyNgrams: false, ngramSize: 3 },
//     { path: 'l_by', applyNgrams: false, ngramSize: 3 },
//     { path: 'r_currency', applyNgrams: false, ngramSize: 3 },
//     { path: 'r_chbs', applyNgrams: false, ngramSize: 3 },
//     { path: 'r_ppd', applyNgrams: false, ngramSize: 3 },
//     { path: 'r_coll', applyNgrams: false, ngramSize: 3 },
//     { path: 'r_other_ppd', applyNgrams: false, ngramSize: 3 },
//     { path: 'r_other_coll', applyNgrams: false, ngramSize: 3 },
//     { path: 'declared_valued_of_carriage', applyNgrams: false, ngramSize: 3 },
//     { path: 'declared_value_of_customs', applyNgrams: false, ngramSize: 3 },
//     { path: 'airport_of_destination', applyNgrams: false, ngramSize: 3 },
//     { path: 'requested_flight', applyNgrams: false, ngramSize: 3 },
//     { path: 'amount_of_insurance', applyNgrams: false, ngramSize: 3 },
//     { path: 'handing_infor', applyNgrams: false, ngramSize: 3 },
//     { path: 'lines.description', applyNgrams: false, ngramSize: 3 },
//     { path: 'other_Charges', applyNgrams: false, ngramSize: 3 },
//     { path: 'at_place', applyNgrams: false, ngramSize: 3 },
//     { path: 'signature_of_shipper_or_agent', applyNgrams: false, ngramSize: 3 },
//     { path: 'signature_of_issuing_carrier', applyNgrams: false, ngramSize: 3 }

//     /**
//      *  ? -----------------------------
//      *  * ROA MANIFEST 1
//      *  ? -----------------------------
//      */
//     //   ustoms_office_of_exit: string;
//     //   customs_office_of_entry: string;
//     //   driver: string;
//     //   nationality: string;
//     //   passport: string;
//     //   code: string;
//     //   license: string;
//     //   head: string;
//     //   van: string;

//     //   // lines: (InterfaceRoeWayBilst1 | InterfaceRoeWayBilst2)[];
//     //   lines: Array<InterfaceRoeWayBilst1 | InterfaceRoeWayBilst2>;
//     /**
//      *  ? -----------------------------
//      *  * ROA ST 1
//      *  ? -----------------------------
//      */
//     //   shipping_agent: string;
//     //   place_and_country_of_origin: string;
//     //   notify_and_deliver_cargo_at: string;
//     //   transport_unit: string;
//     //   place_of_loading: string;
//     //   place_of_unloading: string;
//     //   destination: string;
//     //   customs_office_of_exit: string;
//     //   customs_office_of_entry: string;
//     //   final_destination: string;
//     //   made_by: string;
//     //   authorized_by: string;
//     //   footer: string;
//     //   total_no_pkgs: number;
//     //   total_gross_weight: number;
//     //   totalPrepaid: number;
//     //   totalCollect: number;
//     //   lines: InterFaceLines[];
//     //   freight_charges: InterFaceFreightChargesFather[];
//     /**
//      *  ? -----------------------------
//      *  * ROA ST 2
//      *  ? -----------------------------
//      */
//     //   comments: string;
//     //   notify_to: string;
//     //   final_destination_of_the_goods: string;
//     //   place_of_loading: string;
//     //   place_of_unloading: string;
//     //   customs_office_of_exit: string;
//     //   customs_office_of_entry: string;
//     //   country_of_loading: string;
//     //   driver: string;
//     //   passport: string;
//     //   nationality: string;
//     //   carrier: string;
//     //   code: string;
//     //   license: string;
//     //   head: string;
//     //   van: string;
//     //   transport: string;
//     //   total_no_pkgs: number;
//     //   total_gross_weight: number;
//     //   totalPrepaid: number;
//     //   totalCollect: number;
//     //   lines: InterFaceLines[];
//     //   freight_charges: InterFaceFreightChargesFather[];
//     /**
//      *  ? -----------------------------
//      *  * SEA ST 1
//      *  ? -----------------------------
//      */
//     //   booking_number: string;
//     //   export_reference: string;
//     //   forwarding_agent: string;
//     //   notify_party: string;
//     //   for_delivery: string;
//     //   point_and_contry_of_goods: string;
//     //   precarrier_by: string;
//     //   place_of_receipt: string;
//     //   vessel: string;
//     //   port_of_loading: string;
//     //   loading_pier_terminal: string;
//     //   port_of_discharge: string;
//     //   place_of_delivery: string;
//     //   type_of_move: string;
//     //   shipper_value: string;
//     //   freight_payable: string;
//     //   number_of_bls: number;
//     //   linesDescription: string;
//     //   total_no_pkgs: number;
//     //   total_gross_weight: number;
//     //   totalPrepaid: number;
//     //   totalCollect: number;
//     //   particulars_furnished: InterFaceLines[];
//     //   freight_charges: InterFaceFreightChargesFather[];
//     /**
//      *  ? -----------------------------
//      *  * SEA ST 2
//      *  ? -----------------------------
//      */
//     //   notify_party: string;
//     // 	pre_carriage_bt: string;
//     // 	place_of_receipt: string;
//     // 	freight_to_be: string;
//     // 	no_original_bls: string;
//     // 	vessel: string;
//     // 	port_of_loading: string;
//     // 	port_of_discharge: string;
//     // 	final_place_of_delivery: string;
//     // 	voyage_number: string;
//     // 	totalContainer: number;
//     // 	linesDescription: string;
//     // 	lines: InterfaceLine[];
// ];

// /**
//  *  ? -----------------------------
//  *  * The father of the bill of landing
//  *  ? -----------------------------
//  */
// export const blFatherValueKeySettings: ValueKeyConfigItem[] = [
//     // Father
//     { path: 'id', applyNgrams: false },
//     { path: 'docID', applyNgrams: true, ngramSize: 3 },
//     { path: 'linesDescription', applyNgrams: true, ngramSize: 3 }
// ];

// /**
//  *  ? -----------------------------
//  *  * ROA
//  *  ? -----------------------------
//  */
// export const biIndexROAManisfest1: ValueKeyConfigItem[] = [
//     // Father
//     ...blFatherValueKeySettings,
//     // shipper: string;
//     { path: 'lines.shipper', applyNgrams: false },
//     // consignee: string;
//     { path: 'lines.consignee', applyNgrams: false },
//     // consignee: string;
//     { path: 'lines.linesDescription', applyNgrams: false },
//     //  customs_office_of_exit: string;
//     { path: 'customs_office_of_exit', applyNgrams: false },
//     //  customs_office_of_entry: string;
//     { path: 'customs_office_of_entry', applyNgrams: false },
//     //  driver: string;
//     { path: 'driver', applyNgrams: false },
//     //  nationality: string;
//     { path: 'nationality', applyNgrams: false },
//     //  passport: string;
//     { path: 'passport', applyNgrams: false },
//     //  code: string;
//     { path: 'code', applyNgrams: false },
//     //  license: string;
//     { path: 'license', applyNgrams: false },
//     //  head: string;
//     { path: 'head', applyNgrams: false },
//     //  van: string;
//     { path: 'van', applyNgrams: false }
// ];
// export const biIndexROAForm1: ValueKeyConfigItem[] = [
//     // Father
//     ...blFatherValueKeySettings,
//     // shipper: string;
//     { path: 'shipper', applyNgrams: false },
//     // shipping_agent: string;
//     { path: 'shipping_agent', applyNgrams: false },
//     // consignee: string;
//     { path: 'consignee', applyNgrams: false },
//     // place_and_country_of_origin: string;
//     { path: 'place_and_country_of_origin', applyNgrams: false },
//     // notify_and_deliver_cargo_at: string;
//     { path: 'notify_and_deliver_cargo_at', applyNgrams: false },
//     // transport_unit: string;
//     { path: 'transport_unit', applyNgrams: false },
//     // place_of_loading: string;
//     { path: 'place_of_loading', applyNgrams: false },
//     // place_of_unloading: string;
//     { path: 'place_of_unloading', applyNgrams: false },
//     // destination: string;
//     { path: 'destination', applyNgrams: false },
//     // customs_office_of_exit: string;
//     { path: 'customs_office_of_exit', applyNgrams: false },
//     // customs_office_of_entry: string;
//     { path: 'customs_office_of_entry', applyNgrams: false },
//     // final_destination: string;
//     { path: 'final_destination', applyNgrams: false },
//     // made_by: string;
//     { path: 'made_by', applyNgrams: false },
//     // authorized_by: string;
//     { path: 'authorized_by', applyNgrams: false },
//     // footer: string;
//     { path: 'footer', applyNgrams: false }
//     // total_no_pkgs: number;
//     // total_gross_weight: number;
//     // totalPrepaid: number;
//     // totalCollect: number;
//     // lines: InterFaceLines[];
//     // freight_charges: InterFaceFreightChargesFather[];
// ];
// export const biIndexROAForm2: ValueKeyConfigItem[] = [
//     // Father
//     ...blFatherValueKeySettings,
//     // shipper: string;
//     { path: 'shipper', applyNgrams: false },
//     // consignee: string;
//     { path: 'consignee', applyNgrams: false },
//     // comments: string;
//     { path: 'comments', applyNgrams: false },
//     // notify_to: string;
//     { path: 'notify_to', applyNgrams: false },
//     // final_destination_of_the_goods: string;
//     { path: 'final_destination_of_the_goods', applyNgrams: false },
//     // place_of_loading: string;
//     { path: 'place_of_loading', applyNgrams: false },
//     // place_of_unloading: string;
//     { path: 'place_of_unloading', applyNgrams: false },
//     // customs_office_of_exit: string;
//     { path: 'customs_office_of_exit', applyNgrams: false },
//     // customs_office_of_entry: string;
//     { path: 'customs_office_of_entry', applyNgrams: false },
//     // country_of_loading: string;
//     { path: 'country_of_loading', applyNgrams: false },
//     // driver: string;
//     { path: 'driver', applyNgrams: false },
//     // passport: string;
//     { path: 'passport', applyNgrams: false },
//     // nationality: string;
//     { path: 'nationality', applyNgrams: false },
//     // carrier: string;
//     { path: 'carrier', applyNgrams: false },
//     // code: string;
//     { path: 'code', applyNgrams: false },
//     // license: string;
//     { path: 'license', applyNgrams: false },
//     // head: string;
//     { path: 'head', applyNgrams: false },
//     // van: string;
//     { path: 'van', applyNgrams: false },
//     // transport: string;
//     { path: 'transport', applyNgrams: false }
//     // total_no_pkgs: number;
//     // total_gross_weight: number;
//     // totalPrepaid: number;
//     // totalCollect: number;
//     // lines: InterFaceLines[];
//     // freight_charges: InterFaceFreightChargesFather[];
// ];
// /**
//  *  ? -----------------------------
//  *  * AIR
//  *  ? -----------------------------
//  */
// export const biIndexAIRForm1: ValueKeyConfigItem[] = [
//     // Father
//     ...blFatherValueKeySettings,
//     //
//     // hawb: string;
//     { path: 'hawb', applyNgrams: true, ngramSize: 3 },
//     // shipper: string;
//     { path: 'shipper', applyNgrams: false },
//     // consignee: string;
//     { path: 'consignee', applyNgrams: false },
//     // issuing_carrier_name_address: string;
//     { path: 'issuing_carrier_name_address', applyNgrams: false },
//     // agents_iata: string;
//     { path: 'agents_iata', applyNgrams: false },
//     // accounting_info: string;
//     { path: 'accounting_info', applyNgrams: false },
//     // airport_ofdeparture_and_requested_routing: string;
//     {
//         path: 'airport_ofdeparture_and_requested_routing',
//         applyNgrams: false
//     },
//     // reference_number: string;
//     {
//         path: 'reference_number',
//         applyNgrams: false
//     },
//     // -------------------------------------
//     // to: string;
//     // first_carrier: string;
//     // l_to: string;
//     // l_by: string;
//     // r_currency: string;
//     // r_chbs: string;
//     // r_ppd: string;
//     // r_coll: string;
//     // r_other_ppd: string;
//     // r_other_coll: string;
//     // -------------------------------------
//     // declared_valued_of_carriage: string;
//     { path: 'declared_valued_of_carriage', applyNgrams: false },
//     // declared_value_of_customs: string;
//     { path: 'declared_value_of_customs', applyNgrams: false },
//     // airport_of_destination: string;
//     { path: 'airport_of_destination', applyNgrams: false },
//     // requested_flight: string;
//     { path: 'requested_flight', applyNgrams: false },
//     // amount_of_insurance: string;
//     { path: 'amount_of_insurance', applyNgrams: false },
//     // handing_infor: string;
//     { path: 'handing_infor', applyNgrams: false }
//     // -------------------------------------
//     // other_Charges: string;
//     // at_place: string;
//     // signature_of_shipper_or_agent: string;
//     // signature_of_issuing_carrier: string;
//     // totalPrepaid: number;
//     // totalCollect: number;
//     // -------------------------------------
//     // freight_charges: InterFaceFreightChargesFather[];
//     // lines: InterfaceLineItem[];
// ];
// /**
//  *  ? -----------------------------
//  *  * SEA
//  *  ? -----------------------------
//  */
// export const biIndexSEAForm1: ValueKeyConfigItem[] = [
//     // Father
//     ...blFatherValueKeySettings,
//     // shipper
//     { path: 'shipper', applyNgrams: false },
//     // booking_number: string;
//     { path: 'booking_number', applyNgrams: false },
//     // export_reference: string;
//     { path: 'export_reference', applyNgrams: false },
//     // consignee: string;
//     { path: 'consignee', applyNgrams: false },
//     // forwarding_agent: string;
//     { path: 'forwarding_agent', applyNgrams: false },
//     // for_delibery_apply_to: string;
//     { path: 'for_delibery_apply_to', applyNgrams: false },
//     // notify_party: string;
//     { path: 'notify_party', applyNgrams: false },
//     // for_delivery: string;
//     { path: 'for_delivery', applyNgrams: false },
//     // point_and_contry_of_goods: string;
//     { path: 'point_and_contry_of_goods', applyNgrams: false },
//     // precarrier_by: string;
//     { path: 'precarrier_by', applyNgrams: false },
//     // place_of_receipt: string;
//     { path: 'place_of_receipt', applyNgrams: false },
//     // vessel: string;
//     { path: 'vessel', applyNgrams: false },
//     // port_of_loading: string;
//     { path: 'port_of_loading', applyNgrams: false },
//     // loading_pier_terminal: string;
//     { path: 'loading_pier_terminal', applyNgrams: false },
//     // port_of_discharge: string;
//     { path: 'port_of_discharge', applyNgrams: false },
//     // place_of_delivery: string;
//     { path: 'place_of_delivery', applyNgrams: false },
//     // type_of_move: string;
//     { path: 'type_of_move', applyNgrams: false },
//     // shipper_value: string;
//     { path: 'shipper_value', applyNgrams: false },
//     // freight_payable: string;
//     { path: 'freight_payable', applyNgrams: false }
//     // number_of_bls: number;
//     // linesDescription: string;
//     // total_no_pkgs: number;
//     // total_gross_weight: number;
//     // totalPrepaid: number;
//     // totalCollect: number;
//     // particulars_furnished: InterFaceLines[];
//     // freight_charges: InterFaceFreightChargesFather[];
// ];
// export const biIndexSEAForm2: ValueKeyConfigItem[] = [
//     // Father
//     ...blFatherValueKeySettings,
//     // shipper: string;
//     { path: 'shipper', applyNgrams: false },
//     // consignee: string;
//     { path: 'consignee', applyNgrams: false },
//     // `notify_party: string;
//     { path: 'notify_party', applyNgrams: false },
//     // pre_carriage_bt: string;
//     { path: 'pre_carriage_bt', applyNgrams: false },
//     // place_of_receipt: string;
//     { path: 'place_of_receipt', applyNgrams: false },
//     // freight_to_be: string;
//     { path: 'freight_to_be', applyNgrams: false },
//     // no_original_bls: string;
//     { path: 'no_original_bls', applyNgrams: false },
//     // vessel: string;
//     { path: 'vessel', applyNgrams: false },
//     // port_of_loading: string;
//     { path: 'port_of_loading', applyNgrams: false },
//     // port_of_discharge: string;
//     { path: 'port_of_discharge', applyNgrams: false },
//     // final_place_of_delivery: string;
//     { path: 'final_place_of_delivery', applyNgrams: false },
//     // voyage_number: string;
//     { path: 'voyage_number', applyNgrams: false }
//     // totalContainer: number;
//     // linesDescription: string;
//     // lines: InterfaceLine[];
// ];

// export const generateIndexBillOfLanding = (
//     data: InterfaceFatherBillOfLanding
// ) => {
//     const blType = data.blType;
//     let selectedIndex: ValueKeyConfigItem[] = [];
//     switch (blType) {
//         case EnumTypeBL.ROA_MANIFEST1: {
//             selectedIndex = biIndexROAManisfest1;
//             break;
//         }
//         case EnumTypeBL.ROA_FORM1: {
//             selectedIndex = biIndexROAForm1;
//             break;
//         }
//         case EnumTypeBL.ROA_FORM2: {
//             selectedIndex = biIndexROAForm2;
//             break;
//         }

//         case EnumTypeBL.SEA_FORM1: {
//             selectedIndex = biIndexSEAForm1;
//             break;
//         }
//         case EnumTypeBL.SEA_FORM2: {
//             selectedIndex = biIndexSEAForm2;
//             break;
//         }

//         case EnumTypeBL.AIR_FORM1: {
//             selectedIndex = biIndexAIRForm1;
//             break;
//         }
//         default: {
//             selectedIndex = [];
//         }
//     }
//     return selectedIndex;
// };
