import { db } from '@src/customAgencyTool/core';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import type {
    ICategoryRepository,
    IUpdateCategory
} from '../application/category.useCase';
import type {
    InterfaceCategory,
    InterfaceCategoryOnSave
} from '../domain/calendarEvent.entity';

export class FirebaseCategoryRepository implements ICategoryRepository {
    // Configuración estática usando un objeto para mejor organización
    private static readonly CONFIG = {
        collections: {
            APP_SETTINGS: 'appSettings'
        },
        documents: {
            CATEGORY_ID: 'data-id-categories-calendar'
        },
        types: {
            CATEGORY_TYPE: 'CONFIG_CALENDAR_CATEGORY'
        }
    } as const;

    // Referencia al collection memorizada
    private readonly categoriesCollectionRef = collection(
        db,
        FirebaseCategoryRepository.CONFIG.collections.APP_SETTINGS
    );

    // Referencia al documento memorizada
    private readonly categoryDocRef = doc(
        this.categoriesCollectionRef,
        FirebaseCategoryRepository.CONFIG.documents.CATEGORY_ID
    );

    /**
     * Crea un documento de categorías vacío
     * @returns InterfaceCategoryOnSave
     */
    private createEmptyDocument(): InterfaceCategoryOnSave {
        const categories: InterfaceCategory[] = [];
        const emptyData: InterfaceCategoryOnSave = {
            id: FirebaseCategoryRepository.CONFIG.documents.CATEGORY_ID,
            type: FirebaseCategoryRepository.CONFIG.types.CATEGORY_TYPE,
            categories: categories
        };
        return emptyData;
    }

    /**
     * Lee las categorías del calendario
     * @throws Error si hay un problema al leer/escribir en Firestore
     * @returns Promise<InterfaceCategory[]>
     */
    public async readCategory(): Promise<InterfaceCategory[]> {
        try {
            const docSnap = await getDoc(this.categoryDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as InterfaceCategoryOnSave;
                return data.categories || [];
            }

            // Si no existe, crear documento vacío
            const emptyData = this.createEmptyDocument();
            await setDoc(this.categoryDocRef, emptyData);

            return emptyData.categories;
        } catch (error) {
            console.error('Error al leer categorías:', error);
            throw new Error('No se pudieron cargar las categorías');
        }
    }

    /**
     * Actualiza las categorías del calendario
     * @param args - Objeto con las categorías a actualizar
     * @throws Error si hay un problema al actualizar en Firestore
     */
    public async updateCategory(args: IUpdateCategory): Promise<void> {
        try {
            const { categories } = args;

            const dataToUpdate: InterfaceCategoryOnSave = {
                id: FirebaseCategoryRepository.CONFIG.documents.CATEGORY_ID,
                type: FirebaseCategoryRepository.CONFIG.types.CATEGORY_TYPE,
                categories
            };

            await setDoc(this.categoryDocRef, dataToUpdate);
        } catch (error) {
            console.error('Error al actualizar categorías:', error);
            throw new Error('No se pudieron actualizar las categorías');
        }
    }

    /**
     * Verifica si existe el documento de categorías
     * @returns Promise<boolean>
     */
    public async exists(): Promise<boolean> {
        try {
            const docSnap = await getDoc(this.categoryDocRef);
            return docSnap.exists();
        } catch (error) {
            console.error('Error al verificar existencia:', error);
            return false;
        }
    }
}
