const requireLogin = (req, res, next) => {
    if (!req.user) {
        next({ message: "NOT AUTHORIZED" });
    } else {
        next();
    }
}

module.exports = { requireLogin }