
import { Injectable } from '@angular/core';

@Injectable()

export class ProductService {
    public collection = '';
    public position = -1;
    getCorrectId(id: String): String {
        if (id.substr(id.length - 1) != "=") {
            id = id + '=';
        };
        return id;
    }

    savePosition(collection: string, position: number){
        this.collection = collection;
        this.position = position;
    }

    restPosition(){
        this.collection = '';
        this.position = -1;
    }
    
}
