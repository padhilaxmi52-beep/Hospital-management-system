const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
        const field = err.message.match(/for key '(.+)'/)?.[1] || 'field';
        return res.status(409).json({
            success: false,
            message: `Duplicate entry: ${field} already exists.`
        });
    }

    // MySQL foreign key constraint error
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
            success: false,
            message: 'Cannot delete: record is referenced by other data.'
        });
    }

    // JWT errors handled in auth middleware
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: err.name === 'TokenExpiredError' ? 'Token expired. Please login again.' : 'Invalid token.'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
};

module.exports = errorHandler;