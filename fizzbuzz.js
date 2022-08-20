for (let i = 0; i <= 100; i++) {
    let print = ""
    if (i % 3 === 0) {
        print += "Fizz"
    } if (i % 5 === 0) {
        print += "Buzz"
    }
    console.log(print || i)
}