import { db } from 'src/config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { honoreeValidationService } from './validation.service';
import type { Honoree } from 'src/schemas';

export class HonoreeService {
  /**
   * Get all honorees for a user
   * @param userId The user ID
   * @returns A promise that resolves to an array of honorees
   */
  async getHonorees(userId: string): Promise<Honoree[]> {
    const honoreeCollection = collection(db, `/users/${userId}/honorees`);
    const snapshot = await getDocs(honoreeCollection);

    const honorees: Honoree[] = [];
    snapshot.forEach(doc => {
      try {
        const data = doc.data();
        const honoree = honoreeValidationService.parse({
          id: doc.id,
          ...data,
        });
        honorees.push(honoree);
      } catch (error) {
        console.error(`Error validating honoree ${doc.id}:`, error);
        // Skip invalid honorees
      }
    });

    return honorees;
  }

  /**
   * Get a single honoree by ID
   * @param userId The user ID
   * @param honoreeId The honoree ID
   * @returns A promise that resolves to the honoree or null if not found
   */
  async getHonoree(userId: string, honoreeId: string): Promise<Honoree | null> {
    const honoreeRef = doc(db, `/users/${userId}/honorees/${honoreeId}`);
    const snapshot = await getDoc(honoreeRef);

    if (!snapshot.exists()) {
      return null;
    }

    try {
      const data = snapshot.data();
      return honoreeValidationService.parse({
        id: data.id,
        ...data,
      });
    } catch (error) {
      console.error(`Error validating honoree ${honoreeId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new honoree
   * @param userId The user ID
   * @param honoree The honoree data to create
   * @returns A promise that resolves to the created honoree
   */
  async createHonoree(
    userId: string,
    honoree: Omit<Honoree, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Honoree> {
    const honoreeCollection = collection(db, `/users/${userId}/honorees`);

    const now = serverTimestamp();
    const honoreeData = {
      ...honoree,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(honoreeCollection, honoreeData);

    // Get the created document to return the complete honoree
    const snapshot = await getDoc(docRef);
    const data = snapshot.data();

    return honoreeValidationService.parse({
      id: snapshot.id,
      ...data,
      // Convert server timestamps to client timestamps
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Update an existing honoree
   * @param userId The user ID
   * @param honoreeId The honoree ID
   * @param honoree The honoree data to update
   * @returns A promise that resolves to the updated honoree
   */
  async updateHonoree(
    userId: string,
    honoreeId: string,
    honoree: Partial<Omit<Honoree, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Honoree> {
    const honoreeRef = doc(db, `/users/${userId}/honorees/${honoreeId}`);

    const updateData = {
      ...honoree,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(honoreeRef, updateData);

    // Get the updated document to return the complete honoree
    const snapshot = await getDoc(honoreeRef);
    const data = snapshot.data();

    return honoreeValidationService.parse({
      id: snapshot.id,
      ...data,
      // Convert server timestamp to client timestamp for updatedAt
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Delete an honoree
   * @param userId The user ID
   * @param honoreeId The honoree ID
   * @returns A promise that resolves when the honoree is deleted
   */
  async deleteHonoree(userId: string, honoreeId: string): Promise<void> {
    const honoreeRef = doc(db, `/users/${userId}/honorees/${honoreeId}`);
    await deleteDoc(honoreeRef);
  }
}
