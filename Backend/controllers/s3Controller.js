var admin = require('firebase-admin')
const asyncCatch = require('../utils/asyncCatch')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')
const s3Controller = require('./s3Controller')

var serviceAccount = require('../social-media-620ea-firebase-adminsdk-76t2t-2acb9784e9.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'social-media-620ea.appspot.com',
})

const bucket = admin.storage().bucket()

exports.uploadMediaFiles = asyncCatch(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' })
    }

    const imageFile = req.file

    if (!imageFile.mimetype.startsWith('image/')) {
        return res.status(400).json({
            error: 'Invalid file format. Only image files are allowed.',
        })
    }

    const filename = imageFile.originalname

    const blob = bucket.file(filename)

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: imageFile.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            },
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

        const downloadUrl = await blob.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Set an appropriate expiration date
        })

        // Set the uploaded image URL and download URL on the request object for further processing
        req.uploadedFileUrl = imageUrl
        req.uploadedFileDownloadUrl = downloadUrl[0]
    })

    blobStream.end(imageFile.buffer)
    next()
})

exports.uploadBackgroundImage = asyncCatch(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' })
    }

    const imageFile = req.file
    const { userId } = req.params
    const user = await User.findById(userId)

    if (!imageFile.mimetype.startsWith('image/')) {
        return res.status(400).json({
            error: 'Invalid file format. Only image files are allowed.',
        })
    }

    const filename = imageFile.originalname

    const blob = bucket.file(filename)

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: imageFile.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            },
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

        const downloadUrl = await blob.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Set an appropriate expiration date
        })

        // Set the uploaded image URL and download URL on the request object for further processing
        req.uploadedFileUrl = imageUrl
        req.uploadedFileDownloadUrl = downloadUrl[0]

        if (user != null) {
            if (user.backgroundImagePath != '') {
                s3Controller.deleteMediaFile(user.backgroundImagePath)
            }

            user.backgroundImagePath = downloadUrl[0]
            await user.save()
        }

        res.status(200).json({
            backgroundImagePath: downloadUrl[0],
        })
    })

    blobStream.end(imageFile.buffer)
})

exports.uploadProfileImage = asyncCatch(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' })
    }

    const imageFile = req.file
    const { userId } = req.params
    const user = await User.findById(userId)

    if (!imageFile.mimetype.startsWith('image/')) {
        return res.status(400).json({
            error: 'Invalid file format. Only image files are allowed.',
        })
    }

    const filename = imageFile.originalname

    const blob = bucket.file(filename)

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: imageFile.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            },
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

        const downloadUrl = await blob.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Set an appropriate expiration date
        })

        // Set the uploaded image URL and download URL on the request object for further processing
        req.uploadedFileUrl = imageUrl
        req.uploadedFileDownloadUrl = downloadUrl[0]

        if (user != null) {
            if (user.profileImagePath != '') {
                s3Controller.deleteMediaFile(user.profileImagePath)
            }

            user.profileImagePath = downloadUrl[0]
            await user.save()
        }

        res.status(200).json({
            imagePath: downloadUrl[0],
        })
    })

    blobStream.end(imageFile.buffer)
})

exports.deleteMediaFile = async (signedUrl) => {
    try {
        const regex = /\/([^/]+)\?/
        const matches = signedUrl.match(regex)

        if (matches && matches.length >= 2) {
            const extractedString = matches[1]
            await bucket.file(extractedString).delete()
            console.log('File deleted successfully')
        } else {
            console.log('String extraction failed')
        }
    } catch (error) {
        console.error('Error deleting file:', error)
    }
}
