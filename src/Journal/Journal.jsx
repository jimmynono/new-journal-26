import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {db} from '../db'
import { Link } from "react-router-dom";
import { AddJournal } from "./AddJournal";
import firebase from 'firebase/compat/app';


export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [user, setUser] = useState({})

    useEffect(() => {
        const usRegisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setUser(user)
        })
        return () => usRegisterAuthObserver()
    },[user])


    useEffect(() => {
        if (user?.uid === undefined) {
            return
        }
        const entriesQuery = query(collection(db, 'users', user.uid, `journal-entries`), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(entriesQuery, (snapshot) => {
            setEntries(snapshot.docs);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">My Journal</h1>
                <p className="text-gray-500 mt-2">Capture your thoughts, one day at a time.</p>
            </header>

            <section className="bg-white rounded-xl shadow-sm border p-6 mb-10">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">New Entry</h2>
                <AddJournal />
            </section>

            <div className="space-y-6">
                {entries.length > 0 ? (
                    entries.map((entry) => {
                        const data = entry.data();
                        return (
                            <div 
                                key={entry.id} 
                                className="group p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            > 
                                <p className="text-gray-800 leading-relaxed line-clamp-3 mb-4">
                                    {data.entry}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                        {data.createdAt?.toDate().toLocaleDateString() || 'Recent'}
                                    </span>
                                    <Link 
                                        to={`/journal/${entry.id}`}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Read more →
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No entries yet. Start writing!</p>
                    </div>
                )}
            </div>
        </div>
    );
}