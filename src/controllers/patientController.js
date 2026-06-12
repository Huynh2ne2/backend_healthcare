import patientService from '../services/patientService';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor);

    } catch (e) {
        // console.log(e);
        // return res.status(200).json({
        //     errCode: -1,
        //     errMessage: 'Error from the server'
        // })
        console.error("REAL ERROR postBookAppointment:", e);
        console.error("MESSAGE postBookAppointment:", e.message);

        return res.status(500).json({
            errCode: -1,
            errMessage: e.message
        });
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(infor);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}




module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}