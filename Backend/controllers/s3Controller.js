const { v4: uuid } = require('uuid')
const fs = require('fs')
const firebase = require('firebase/compat/app')
require('firebase/compat/storage')
const multer = require('multer')

// Khởi tạo Firebase App
firebase.initializeApp({
    apiKey: 'AIzaSyBVmhEivXz9psZowEKSuQ_MCsuH1PrZaTE',
    authDomain: 'social-media-620ea.firebaseapp.com',
    projectId: 'social-media-620ea',
    storageBucket: 'social-media-620ea.appspot.com',
})

const storage = firebase.default.storage()

exports.uploadMediaFiles = multer({
    storage: multer.memoryStorage(),
}).single('file')

exports.deleteMediaFile = async (path) => {
    try {
        await storage.ref(path).delete()
    } catch (error) {
        console.error('Error deleting file:', error)
    }
}
