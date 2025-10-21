import {
    MyButton,
    MyFlex,
    MyHeading,
    MyInputText
} from '@src/customAgencyTool/components/ui';
import { db } from '@src/customAgencyTool/core';
import type { InterfaceCurrentUser } from '@src/customAgencyTool/features/auth/domain/user.entity';
import { collection, getDocs, query, writeBatch } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { userAdminObservableRepository } from '../../../infrastructure/compositionRoot';
import DynamicTableSTR from '../../components/dynamicTable/dynamicTableStr';
import { autocomplete } from './generateSearchIndices/autocomplete';
import { createInvertedIndex } from './generateSearchIndices/createInvertedIndex';
import {
    generateSearchIndices,
    type ValueKeyConfigItem
} from './generateSearchIndices/generateSearchIndices';

interface SearchIndexAutoComplete {
    id: string;
    searchTerms: string[];
    // Necesitamos el objeto original para devolverlo en los resultados
    original: Record<string, any>;
}
const cofi: ValueKeyConfigItem[] = [
    {
        path: 'id',
        applyNgrams: true,
        ngramSize: 3,
        minWordLengthForNgrams: 2
    },
    {
        path: 'name',
        applyNgrams: true,
        ngramSize: 3,
        minWordLengthForNgrams: 2
    },
    {
        path: 'lastName',
        applyNgrams: true,
        ngramSize: 3,
        minWordLengthForNgrams: 2
    },
    {
        path: 'hobby',
        applyNgrams: true,
        ngramSize: 3,
        minWordLengthForNgrams: 2
    },
    {
        path: 'someText',
        applyNgrams: true,
        ngramSize: 3,
        minWordLengthForNgrams: 2
    }
];

export const UserAdminPage2 = () => {
    const [query, setQuery] = useState<string>('');

    useEffect(() => {
        //
        // 1. Tus datos originales
        const originalObjects = [
            {
                id: '1',
                name: 'Marta',
                lastName: 'Martínez',
                hobby: 'Escribir código'
            },
            { id: '2', name: 'Marcos', lastName: 'Arias', hobby: 'Correr' },
            { id: '3', name: 'Ana', lastName: 'Martínez', hobby: 'Leer' }
        ];

        // Un mapa para acceder rápidamente a los objetos originales por su ID
        const originalDataMap = new Map(
            originalObjects.map((obj) => [obj.id, obj])
        );

        // 2. Genera los índices para cada objeto
        const indexedObjects: SearchIndexAutoComplete[] = originalObjects.map(
            (obj) => {
                // Esta es tu función personalizada
                const generatedIndex = generateSearchIndices(obj, cofi);
                return {
                    ...generatedIndex,
                    original: obj // Guardamos una referencia al objeto original
                };
            }
        );

        // 3. (Paso Clave) Crea el índice invertido (¡haz esto solo una vez!)
        console.log('Creando índice invertido...');
        const invertedIndex = createInvertedIndex(indexedObjects);
        console.log('Índice creado.');

        // 4. ¡Prueba el autocompletado!

        const numberOfResults = 5;

        console.log(`\nBuscando autocompletado para: "${query}"`);
        const results = autocomplete(
            query,
            invertedIndex,
            originalDataMap,
            numberOfResults
        );

        console.log('\nResultados:');
        results.forEach((res) => {
            console.log(res);
        });
    }, [query]);

    const handledOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setQuery(value);
    };

    return (
        <div>
            <h2>User Admin</h2>

            <MyInputText value={query} onChange={handledOnChange} />
        </div>
    );
};

const UserAdminPage = () => {
    return (
        <div>
            <h2>User Admin</h2>

            <TempUpperCaseClienteName />
        </div>
    );
};

export const UserAdminPage1 = () => {
    const userAdminRepo = userAdminObservableRepository;

    const [usersList, setUsersList] = useState<InterfaceCurrentUser[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const loadMoreItems = useCallback(async () => {
        console.log('loadMoreItems');

        userAdminRepo.loadMore();
    }, [userAdminRepo]);

    useEffect(() => {
        const dataSub = userAdminRepo.data$.subscribe(setUsersList);
        const loadingSub = userAdminRepo.loading$.subscribe(setIsLoading);
        const hasMoreSub = userAdminRepo.hasMore$.subscribe(setHasMore);

        return () => {
            dataSub.unsubscribe();
            loadingSub.unsubscribe();
            hasMoreSub.unsubscribe();
        };
    }, [userAdminRepo]);

    useEffect(() => {
        // if (filter) {
        //     usersListRepo.get([
        //         {
        //             direction: 'asc',
        //             field: 'status',
        //             value: filter,
        //             operator: '=='
        //         }
        //     ]);
        // } else {
        //     usersListRepo.get([]);
        // }
        userAdminRepo.get([]);
    }, [userAdminRepo]);

    return (
        <MyFlex direction={'column'} gap={5}>
            <MyHeading>User Admin</MyHeading>

            <DynamicTableSTR
                users={usersList}
                isLoading={isLoading}
                hasMore={hasMore}
                loadMoreItems={loadMoreItems}
            />

            {/* <Agenda /> */}

            {/* <BillofLanding /> */}

            {/* <ProformaInvoice />  */}
        </MyFlex>
    );
};

export default UserAdminPage;

export const TempUpperCaseClienteName = () => {
    const collectionName = 'orderTrakingCollection';
    const fieldName = 'guide';

    const updateCollectionToUppercase = async () => {
        try {
            const MAX_BATCH = 499; // Firestore limit is 500
            let batchCount = 0;
            let totalUpdated = 0;

            console.log('collectionName', collectionName);
            console.log('fieldName', fieldName);
            console.log('MAX_BATCH', MAX_BATCH);
            console.log('Starting update...');

            // Get all documents from collection
            const q = query(collection(db, collectionName));
            const snapshot = await getDocs(q);

            let batch = writeBatch(db);

            for (const doc of snapshot.docs) {
                const data = doc.data();
                const fieldValue = data[fieldName];

                // para que todos los campos sean en mayúsculas
                // batch.update(doc.ref, {
                //     [fieldName]: fieldValue.toUpperCase()
                // });
                // batchCount++;
                // totalUpdated++;

                if (
                    typeof fieldValue === 'string' &&
                    fieldValue === '#b87400'
                ) {
                    batch.update(doc.ref, {
                        [fieldName]: 'mostaza'
                    });
                    batchCount++;
                    totalUpdated++;
                }

                // if (
                //     typeof fieldValue === 'string' &&
                //     fieldValue !== fieldValue.toUpperCase()
                // ) {
                //     batch.update(doc.ref, {
                //         [fieldName]: fieldValue.toUpperCase()
                //     });
                //     batchCount++;
                //     totalUpdated++;
                // }

                if (batchCount === MAX_BATCH) {
                    await batch.commit();
                    batch = writeBatch(db);
                    batchCount = 0;
                }
            }

            if (batchCount > 0) {
                await batch.commit();
            }

            console.log('Finished update.');
            console.log('Total documents updated:', totalUpdated);
            console.log('Total batchCount:', batchCount);

            return {
                success: true,
                documentsUpdated: totalUpdated
            };
        } catch (error) {
            console.error('Error updating collection:', error);
            throw error;
        }
    };

    return (
        <MyButton onClick={updateCollectionToUppercase}>
            Temp Upper Case to key {fieldName} on {collectionName}
        </MyButton>
    );
};
