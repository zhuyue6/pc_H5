const required = { required: true, message: "此项为必填项" };

const phoneReg =
  /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
const phone = {
  validator(value: string) {
    return phoneReg.test(value);
  },
  message: "请正确输入手机号",
};

const verificationCodeReg = /[0-9]{6}$/;
const verificationCode = {
  validator(value: string) {
    return verificationCodeReg.test(value);
  },
  message: "请正确输入验证码",
};

const idReg18 =
  /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
const idReg15 =
  /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;

const id = {
  validator(value: string) {
    return idReg18.test(value) || idReg15.test(value);
  },
  message: "请正确输入身份证号码",
};

export { required, phone, verificationCode, id };
