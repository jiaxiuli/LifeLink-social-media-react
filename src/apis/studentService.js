import axios from './config';

class StudentService {
    getStudentInfoById (studentId) {
        return axios.get(`/get_student_info_by_id?id=${studentId}`);
    }
}

export default new StudentService();
