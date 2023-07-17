var admin = require('firebase-admin')
const multer = require('multer')

var serviceAccount = require('../social-media-620ea-firebase-adminsdk-76t2t-2acb9784e9.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'social-media-620ea.appspot.com',
})

const bucket = admin.storage().bucket()

exports.uploadMediaFiles = () => {
    console.log('Go to back end success')
    multer({
        storage: multer.memoryStorage(),
    }).single('file')
}

exports.deleteMediaFile = async (path) => {
    try {
        await bucket.file(path).delete()
        console.log('File deleted successfully')
    } catch (error) {
        console.error('Error deleting file:', error)
    }
}
