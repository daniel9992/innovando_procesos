import { db } from '@src/customAgencyTool/core';
import {
    collection,
    getDocs,
    limit,
    query,
    QuerySnapshot,
    where,
    type DocumentData
} from 'firebase/firestore';
import { RoleUser } from '../../auth/domain/user.entity';
import type { IUserToSelectedRepository } from '../application/userSelected.useCase';
import type { IReadUserToSelected } from '../domain/readUserToSelected';

export class FirebaseReadUserToSelectedRepository
    implements IUserToSelectedRepository
{
    private static readonly USER_COLLECTION = 'usersCollection';
    private static readonly MAX_USERS = 20;

    /**
     * Lee usuarios con roles diferentes a USER, limitado a un máximo de usuarios.
     * @throws {FirebaseError} Si hay un error al acceder a Firestore
     * @returns Promise<IReadUserToSelected[]> Lista de usuarios filtrados
     */
    public async read(): Promise<IReadUserToSelected[]> {
        try {
            const users = await this.fetchUsersFromFirestore();
            return this.mapUsersData(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users from database');
        }
    }

    private async fetchUsersFromFirestore(): Promise<
        QuerySnapshot<DocumentData>
    > {
        const collectionRef = collection(
            db,
            FirebaseReadUserToSelectedRepository.USER_COLLECTION
        );

        const q = query(
            collectionRef,
            where('role', '!=', RoleUser.USER),
            limit(FirebaseReadUserToSelectedRepository.MAX_USERS)
        );

        return await getDocs(q);
    }

    private mapUsersData(
        querySnapshot: QuerySnapshot<DocumentData>
    ): IReadUserToSelected[] {
        return querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            name: doc.data().name
        }));
    }
}
