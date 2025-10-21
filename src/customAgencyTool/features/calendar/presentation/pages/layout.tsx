import { DivContainer } from '@src/customAgencyTool/components/divContainer/divContainer';
import { MyButton } from '@src/customAgencyTool/components/ui';
import { db } from '@src/customAgencyTool/core';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import { collection, getDocs, query, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css'; // Importante: importa los estilos CSS
import { Outlet } from 'react-router';
import type { InterfaceCalendarEvent } from '../../domain/calendarEvent.entity';
import { adapterCalendar } from '../../domain/utils/adapterCalendar';

const Layout = () => {
    return (
        <DivContainer>
            <Outlet />

            {/* <FixData /> */}
        </DivContainer>
    );
};

export default Layout;

export const FixData = () => {
    const collectionName = 'calendarCollections';

    const [isLoading, setIsLoading] = useState(false);

    const updateCollectionToUppercase = async () => {
        setIsLoading(true);
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
                    id: doc.id,
                    ...doc.data()
                };
                const dataFormat = adapterDate(data) as InterfaceCalendarEvent;

                const dataReady = adapterCalendar(dataFormat);

                batch.update(doc.ref, dataReady);

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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <MyButton onClick={updateCollectionToUppercase} loading={isLoading}>
                Fix Data
            </MyButton>
        </div>
    );
};
