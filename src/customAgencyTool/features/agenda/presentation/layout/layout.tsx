import { DivContainer } from '@src/customAgencyTool/components/divContainer/divContainer';
import { MyButton } from '@src/customAgencyTool/components/ui';
import { db } from '@src/customAgencyTool/core';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { Outlet } from 'react-router';
import type { InterfaceClient } from '../../domain/agendaModel';
import { adapterAgendaInterfaceClient } from '../../infrastructure/utils/adapterAgendaInterfaceClient';

const Layout = () => {
    return (
        <DivContainer>
            <Outlet />
        </DivContainer>
    );
};

export default Layout;

export const FixData = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handledOnClick = async () => {
        setIsLoading(true);
        try {
            const sourceCollectionName = 'usersCollection';
            const targetCollectionName = 'customerContactCollection';

            console.log(
                `Iniciando migración de '${sourceCollectionName}' a '${targetCollectionName}'...`
            );

            const MAX_BATCH_OPERATIONS = 499; // Límite de Firestore es 500
            let batch = writeBatch(db);
            let batchCustomerContact = writeBatch(db);
            let operationCount = 0;
            let totalDocsMigrated = 0;

            // Referencia a la colección de origen
            const sourceCollectionRef = collection(db, sourceCollectionName);
            const snapshot = await getDocs(sourceCollectionRef);

            if (snapshot.empty) {
                console.log(
                    'La colección de origen está vacía. No hay nada que migrar.'
                );
                return;
            }

            console.log(
                `Se encontraron ${snapshot.size} documentos para migrar.`
            );

            for (const document of snapshot.docs) {
                // Datos originales
                const originalData = {
                    ...document.data(),
                    id: document.id
                };

                // ***** LA CORRECCIÓN CLAVE ESTÁ AQUÍ *****
                // Crear una referencia al nuevo documento en la colección de destino
                // Usamos el MISMO ID del documento original.
                const targetDocRef = doc(db, targetCollectionName, document.id);

                // Transformar los datos usando tu función adaptadora
                const transformedData = adapterDate(
                    originalData
                ) as InterfaceClient;

                const fixData = adapterAgendaInterfaceClient(transformedData);

                //
                const newCustomerContact = fixData.customerContact.filter(
                    (item) => item.id.startsWith('new-')
                );
                const customerDocRef = doc(
                    db,
                    targetCollectionName,
                    document.id
                );

                // Añadir la operación de escritura al lote
                fixData.customerContact = [];
                batch.set(targetDocRef, fixData);

                newCustomerContact.forEach((item) => {
                    batchCustomerContact.set(customerDocRef, item);
                });

                operationCount++;
                totalDocsMigrated++;

                // Cuando el lote alcanza el límite, se ejecuta y se reinicia.
                if (operationCount === MAX_BATCH_OPERATIONS) {
                    console.log(
                        `Escribiendo un lote de ${operationCount} documentos...`
                    );
                    await batch.commit();
                    await batchCustomerContact.commit();
                    // Iniciar un nuevo lote
                    batch = writeBatch(db);
                    batchCustomerContact = writeBatch(db);
                    operationCount = 0;
                }
            }

            // Ejecutar el último lote si quedaron operaciones pendientes
            if (operationCount > 0) {
                console.log(
                    `Escribiendo el último lote de ${operationCount} documentos...`
                );
                await batch.commit();
            }

            console.log('✅ Migración completada exitosamente.');
            console.log(
                `   Total de documentos migrados: ${totalDocsMigrated}`
            );
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <MyButton onClick={handledOnClick} loading={isLoading}>
                Fix Data agenda
            </MyButton>
        </div>
    );
};
