import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import {db} from '../db'
import firebase from 'firebase/compat/app';


export default function JournalEntry() {
    const [entry, setEntry] = useState(null)
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const { id } = useParams();
    const navigate = useNavigate()


        useEffect(() => {
            const usRegisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
                setUser(user)
            })
    
            return () => usRegisterAuthObserver()
        },[user])
    

    useEffect(() => {
        if (user.uid === undefined) {
            return
        }
        const getData = async () => {
            const docRef = doc(db, 'users', user.uid, 'journal-entries', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setEntry(docSnap.data())
                setIsLoading(false)
            } else {
                setHasError(true)
                setIsLoading(false)
            }
        }
        getData()
    }, [id, user.uid])

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this memory?")) {
            await deleteDoc(doc(db,'users', user.uid, "journal-entries", id));
            navigate('/journal')
        }
    }

    const handleEdit = async () => {
        const newVal = window.prompt('Edit your journal entry', entry.entry)
        if (newVal === null || newVal === entry.entry) return;

        await setDoc(doc(db, "journal-entries", id), {
            entry: newVal,
            createdAt: new Date()
        });
        // Update local state so the UI refreshes immediately
        setEntry({ ...entry, entry: newVal });
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-400 font-medium">Loading entry...</div>
            </div>
        )
    }

    if (hasError) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-red-50 rounded-xl text-center">
                <h1 className="text-red-800 font-bold text-xl">Entry not found</h1>
                <p className="text-red-600 mt-2">The entry you're looking for might have been deleted.</p>
                <button onClick={() => navigate('/journal')} className="mt-4 text-red-800 underline">Go back</button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Entry Details</span>
                    <h1 className="text-gray-400 text-xs font-mono mt-1">ID: {id}</h1>
                </div>
                <button 
                    onClick={() => navigate('/journal')}
                    className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                    ← Back to List
                </button>
            </header>

            <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
                <p className="text-xl text-gray-800 leading-relaxed whitespace-pre-wrap flex-grow italic font-serif">
                    "{entry.entry}"
                </p>

                <div className="mt-12 pt-6 border-t border-gray-50 flex gap-4">
                    <button 
                        onClick={handleEdit}
                        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                    >
                        Edit Entry
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="flex-1 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all"
                    >
                        Delete
                    </button>
                </div>
            </article>
        </div>
    );
}