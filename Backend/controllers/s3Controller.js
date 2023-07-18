var admin = require('firebase-admin')
const asyncCatch = require('../utils/asyncCatch')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')

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

    const { userId } = req.params
    const user = await User.findById(userId)

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

        if (user.backgroundImagePath != '') {
            // Delete the old file if it exists
            const regex = /\/([^/]+)\?/ // Regular expression to match the desired string
            const matches = url.match(regex) // Apply the regular expression to extract the string

            if (matches && matches.length >= 2) {
                const extractedString = matches[1] // Extracted string is the second element in the matches array
                console.log(extractedString) // Output: "41d87a12-bf9e-478f-8f8d-226198b7a451_bg-image"
            } else {
                console.log('String extraction failed')
            }

            s3Controller.deleteMediaFile(extractedString)
        }

        user.backgroundImagePath = downloadUrl[0] ? downloadUrl[0] : null
        await user.save()

        res.status(200).json({
            backgroundImagePath: downloadUrl[0],
        })
    })

    blobStream.end(imageFile.buffer)
})

exports.deleteMediaFile = async (signedUrl) => {
    try {
        await bucket.file(path).delete()
        console.log('File deleted successfully')
    } catch (error) {
        console.error('Error deleting file:', error)
    }
}
