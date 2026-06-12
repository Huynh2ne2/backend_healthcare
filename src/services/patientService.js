import { resolveContent } from 'nodemailer/lib/shared';
import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {

    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType
                || !data.fullName || !data.selectedGender || !data.address

            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {

                
                let user = await db.Users.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        // genderId:"M",
                        roleId: 'R3',
                        positionId: "P5",
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    }
                });


                if (user && user[0]) {

                    let existAnyDoctor = await db.Bookings.findOne({
                        where: {
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            statusId: 'S1'
                        }
                    });

                    if (existAnyDoctor) {
                        return resolve({
                            errCode: 3,
                            errMessage: 'You already have an appointment at this time!'
                        });
                    }

                    let existSameDoctor = await db.Bookings.findOne({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType,
                            statusId: 'S1'
                        }
                    });

                    if (existSameDoctor) {
                        return resolve({
                            errCode: 2,
                            errMessage: 'You already booked this doctor at this time!'
                        });
                    }

                    await db.Bookings.create({
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
                    });
                }
                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });
                
                resolve({
                    data: user,
                    errCode: 0,
                    errMessage: 'Save infor patient success'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                console.log("=== BEFORE QUERY ===");
                console.log({
                    doctorId: Number(data.doctorId),
                    token: data.token?.trim()
                });
                console.log("===================");
                let appointment = await db.Bookings.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                        // statusId: { [Op.in]: ['S1'] }
                    },
                    raw: false,
                })
                console.log("DEBUG APPOINTMENT status verify:", appointment);

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update appointment successful!!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}