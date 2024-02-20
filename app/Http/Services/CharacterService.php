<?php

namespace App\Http\Services;

use App\Http\Resources\CharacterResource;
use App\Models\Character;

class CharacterService extends Service
{
    /*
     * Show Character
     */
    public function show($id)
    {
        $character = Character::where("character_id", $id)->firstOrFail();

        return new CharacterResource($character);
    }

    /*
     * Store Character
     */
    public function store($request)
    {
        // Check if User has saved notes
        $characterQuery = Character::where("character_id", $request->characterId);

        if ($characterQuery->doesntExist()) {
            $character = new Character;

            $message = "Notes saved";
        } else {
            $character = $characterQuery->first();

            $message = "Notes updated";
        }

        $character->character_id = $request->input("characterId");
        $character->notes = $request->input("notes");
        $saved = $character->save();

        return [$saved, $message, $character];
    }
}
