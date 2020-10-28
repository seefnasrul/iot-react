export function Rupiah(num) {
    if(num){
        return 'IDR '+num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }else{
        return num;
    }
}

export function SortParagraph(str){
    return str.slice(0, 100);
}

export const replaceFailedQuotes = (str) => {
    return str;
    if(str !== null){
        // return str;
        // var new_str = str.replace('&#34;"','"');
        return str.replace('&#34;','');
    }else{
        return "";
    }

}