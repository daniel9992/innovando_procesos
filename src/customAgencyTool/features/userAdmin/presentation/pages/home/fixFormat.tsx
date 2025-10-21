import { MyButton } from '@src/customAgencyTool/components/ui';
import { db } from '@src/customAgencyTool/core';
import type { InterfaceSuppliersControl } from '@src/customAgencyTool/features/orderTraking/04suppliersControl/domain/sc.model';
import { getSCReady } from '@src/customAgencyTool/features/orderTraking/04suppliersControl/domain/utils/getSCReady';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import { collection, getDocs, query, writeBatch } from 'firebase/firestore';

// const valuesReady = getSCReady(values);
const FixFormat = () => {
    const collectionName = 'suppliersControlCollection';

    const updateCollectionToUppercase = async () => {
        try {
            const MAX_BATCH = 499; // Firestore limit is 500
            let batchCount = 0;
            let totalUpdated = 0;

            // Get all documents from collection
            const q = query(collection(db, collectionName));
            const snapshot = await getDocs(q);

            let batch = writeBatch(db);

            for (const doc of snapshot.docs) {
                const data = {
                    ...doc.data(),
                    id: doc.id
                };
                const adapter = adapterDate(data) as InterfaceSuppliersControl;

                const valuesReady = getSCReady(adapter);

                batch.update(doc.ref, valuesReady);
                batchCount++;
                totalUpdated++;

                if (batchCount === MAX_BATCH) {
                    await batch.commit();
                    batch = writeBatch(db);
                    batchCount = 0;
                }
            }

            if (batchCount > 0) {
                await batch.commit();
            }

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
            Fix Format Collection {collectionName}
        </MyButton>
    );
};

export default FixFormat;
