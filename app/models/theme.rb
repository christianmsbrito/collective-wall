class Theme < ApplicationRecord
  belongs_to :themeable, polymorphic: true
end
