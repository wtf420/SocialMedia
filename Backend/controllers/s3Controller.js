var admin = require('firebase-admin')
const asyncCatch = require('../utils/asyncCatch')
const { v4: uuidv4 } = require('uuid')

var serviceAccount = require('../social-media-620ea-firebase-adminsdk-76t2t-2acb9784e9.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'social-media-620ea.appspot.com',
})

const bucket = admin.storage().bucket()

exports.uploadMediaFiles = async (req, res, next) => {
    console.log(req.file)
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' })
    }

    const imageFile = req.file

    if (!imageFile.mimetype.startsWith('image/')) {
        return res.status(400).json({
            error: 'Invalid file format. Only image files are allowed.',
        })
    }

    const filename = `${uuidv4()}.${imageFile.mimetype.split('/')[1]}`

    const blob = bucket.file(filename)

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: imageFile.mimetype,
        },
    })

    blobStream.on('error', (err) => {
        console.error('Error uploading image to Firebase:', err)
        return res.status(500).json({ error: 'Failed to upload image' })
    })

    blobStream.on('finish', async () => {
        // Make the image file publicly accessible
        await blob.makePublic()

        // Get the uploaded image URL
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

        // Set the uploaded image URL on the request object for further processing
        req.uploadedFileUrl = imageUrl

        return next()
    })

    blobStream.end(imageFile.data)
}

exports.deleteMediaFile = async (path) => {
    try {
        await bucket.file(path).delete()
        console.log('File deleted successfully')
    } catch (error) {
        console.error('Error deleting file:', error)
    }
}
