


export const createuser = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(200).json({
            status: 200,
            success: true,
            message: "User updated successfully!",
            result: user
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update user! Please try again later."
        });
    }
}
