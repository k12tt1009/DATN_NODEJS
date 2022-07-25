import searchService from '../services/searchService';

let getSearchByKeyword = async (req, res) => {
    try {
        let infor = await searchService.getSearchByKeyword(req.query.keyword);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

module.exports = {
    getSearchByKeyword: getSearchByKeyword
}