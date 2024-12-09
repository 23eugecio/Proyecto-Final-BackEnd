
export const validateContactId = (req, res, next) => {
    const { contact_id } = req.params;

    if (!contact_id || isNaN(contact_id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
    }
    next();
};


