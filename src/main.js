export default function () {
  console.log('12345')

  var a = []

  a.forEach((item) => {
    console.log(this.a)
    console.log(item)
  })
}
