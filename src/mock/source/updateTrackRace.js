import Mock from 'mockjs';

Mock.mock(/\/api\/updateTrackRace/, 'post', function () {
  return {
    "code": '301000',
    "message": "success",
    "data": {}
  }
})

