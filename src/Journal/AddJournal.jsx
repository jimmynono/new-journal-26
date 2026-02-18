import React, { useState, useEffect } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import {db} from '../db'
import firebase from 'firebase/compat/app';


export function AddJournal() {
  const [entry, setEntry] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false) // Added for a better UX

      const [user, setUser] = useState({})
  
      useEffect(() => {
          const usRegisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
              setUser(user)
          })
  
          return () => usRegisterAuthObserver()
      },[user])
  
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!entry.trim()) return; // Don't submit empty entries

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'users', user.uid, "journal-entries"), {
        entry: entry,
        createdAt: new Date()
      });
      setEntry('')
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label 
            htmlFor="entry-input" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What's on your mind?
          </label>
          <textarea 
            name="entry-input" 
            id="entry-input" 
            rows={4}
            className="w-full p-4 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all outline-none resize-none placeholder-gray-400"
            placeholder="Start typing your entry here..."
            value={entry}
            onChange={e => setEntry(e.target.value)}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !entry.trim()}
          className="self-end px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-sm active:transform active:scale-95"
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  )
}